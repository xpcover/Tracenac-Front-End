import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import CreatePartnerForm from './PartnerForm';

interface Partner {
  _id: string;
  partnerId: string;
  partnerName: string;
  partnerCategory: string;
  city: string;
  pincode: string;
  partnerUserEmailId: string;
  partnerAppUserPhoneNo: string;
  country: string;
  company: string;
  lat: string;
  long: string;
  assignedPerson: string;
}

const PartnerList: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('https://api.tracenac.com/api/partner', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }

      const data = await response.json();
      setPartners(data.msg);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const handleDelete = async (partnerId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`https://api.tracenac.com/api/partners/${partnerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete partner');
      }

      setPartners(partners.filter((partner) => partner._id !== partnerId));
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  const handleFormSubmit = async (data: Partner) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('https://api.tracenac.com/api/partners', {
        method: editingPartner ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingPartner ? 'update' : 'create'} partner`);
      }

      const updatedPartner = await response.json();

      if (editingPartner) {
        setPartners(partners.map((partner) => (partner._id === updatedPartner._id ? updatedPartner : partner)));
      } else {
        setPartners([...partners, updatedPartner]);
      }

      setIsModalOpen(false);
      setEditingPartner(null);
    } catch (error) {
      console.error(`Error ${editingPartner ? 'updating' : 'creating'} partner:`, error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Partners</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Partner</Button>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Partner ID</th>
            <th className="px-4 py-2 border-b">Partner Name</th>
            <th className="px-4 py-2 border-b">Category</th>
            <th className="px-4 py-2 border-b">City</th>
            <th className="px-4 py-2 border-b">Pincode</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Phone</th>
            <th className="px-4 py-2 border-b">Country</th>
            <th className="px-4 py-2 border-b">Company</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner._id}>
              <td className="px-4 py-2 border-b">{partner.partnerId}</td>
              <td className="px-4 py-2 border-b">{partner.partnerName}</td>
              <td className="px-4 py-2 border-b">{partner.partnerCategory}</td>
              <td className="px-4 py-2 border-b">{partner.city}</td>
              <td className="px-4 py-2 border-b">{partner.pincode}</td>
              <td className="px-4 py-2 border-b">{partner.partnerUserEmailId}</td>
              <td className="px-4 py-2 border-b">{partner.partnerAppUserPhoneNo}</td>
              <td className="px-4 py-2 border-b">{partner.country}</td>
              <td className="px-4 py-2 border-b">{partner.company}</td>
              <td className="px-4 py-2 border-b">
                <Button variant="ghost" onClick={() => handleEdit(partner)}>
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => handleDelete(partner._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPartner(null);
        }}
        title={editingPartner ? 'Edit Partner' : 'Add Partner'}
      >
        <CreatePartnerForm
          partner={editingPartner}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  );
};

export default PartnerList;