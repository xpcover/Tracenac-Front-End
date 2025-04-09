import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';

interface User {
  id: string;
  name: string;
}

const CreatePartnerForm: React.FC = () => {
    const navigate = useNavigate()

  const [partnerId, setPartnerId] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [partnerCategory, setPartnerCategory] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [partnerUserEmailId, setPartnerUserEmailId] = useState('');
  const [partnerAppUserPhoneNo, setPartnerAppUserPhoneNo] = useState('');
  const [country, setCountry] = useState('');
  const [company, setCompany] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [assignedPerson, setAssignedPerson] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('https://api.tracenac.com/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.msg);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude.toString());
        setLong(position.coords.longitude.toString());
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const partnerData = {
      partnerId,
      partnerName,
      partnerCategory,
      city,
      pincode,
      partnerUserEmailId,
      partnerAppUserPhoneNo,
      country,
      company,
      lat,
      long,
    };

    try {
      const response = await fetch('https://api.tracenac.com/api/partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(partnerData),
      });

      if (!response.ok) {
        throw new Error('Failed to create partner');
      }

      alert('Partner created successfully');
    } catch (error) {
      console.error('Error creating partner:', error);
    }
  };

  return (
    <div className="space-y-6">
    <PageHeader
      title="Add Partner"
      description="Create a new partner"
    >
      <Button variant="ghost" onClick={() => navigate('/asset-history')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Partners
      </Button>
    </PageHeader>
    <div className="max-w-3xl mx-auto" >
        <div className="bg-white rounded-lg shadow " style={{ padding: '50px' }}>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="partnerId" className="block text-sm font-medium text-gray-700">
          Partner ID
        </label>
        <Input
          id="partnerId"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700">
          Partner Name
        </label>
        <Input
          id="partnerName"
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="partnerCategory" className="block text-sm font-medium text-gray-700">
          Partner Category
        </label>
        <Input
          id="partnerCategory"
          value={partnerCategory}
          onChange={(e) => setPartnerCategory(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <Input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
          Pincode
        </label>
        <Input
          id="pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="partnerUserEmailId" className="block text-sm font-medium text-gray-700">
          Partner User Email ID
        </label>
        <Input
          id="partnerUserEmailId"
          type="email"
          value={partnerUserEmailId}
          onChange={(e) => setPartnerUserEmailId(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="partnerAppUserPhoneNo" className="block text-sm font-medium text-gray-700">
          Partner App User Phone No
        </label>
        <Input
          id="partnerAppUserPhoneNo"
          value={partnerAppUserPhoneNo}
          onChange={(e) => setPartnerAppUserPhoneNo(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <Input
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
          Company
        </label>
        <Input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
          Latitude
        </label>
        <Input
          id="lat"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="mt-1"
          readOnly
        />
      </div>

      <div>
        <label htmlFor="long" className="block text-sm font-medium text-gray-700">
          Longitude
        </label>
        <Input
          id="long"
          value={long}
          onChange={(e) => setLong(e.target.value)}
          className="mt-1"
          readOnly
        />
      </div>

      <Button type="button" onClick={handleGetLocation} className="mt-2">
        Get Location
      </Button>

      <div>
        <label htmlFor="assignedPerson" className="block text-sm font-medium text-gray-700">
          Assigned Person
        </label>
        <select
          id="assignedPerson"
          value={assignedPerson}
          onChange={(e) => setAssignedPerson(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="mt-4">
        Save Partner
      </Button>
    </form>
    </div>
      </div>
      </div>

  );
};

export default CreatePartnerForm;