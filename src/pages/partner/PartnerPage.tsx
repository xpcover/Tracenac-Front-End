import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Partner, User } from '@/lib/types'
import  PartnerForm from './PartnerForm'
import axios from 'axios'
import { Phone } from 'lucide-react'

// {
//   "_id": "67ff36ebb7b77914462e4c7f",
//   "partnerId": "12345",
//   "partnerName": "Parth's Retail Store",
//   "partnerCategory": "retail",
//   "city": "Mumbai",
//   "pincode": 400001,
//   "partnerUserEmailId": "parth@example.com",
//   "partnerAppUserPhoneNo": 9876543210,
//   "country": "India",
//   "company": "Parth's Retail Pvt. Ltd.",
//   "lat": "19.0241585",
//   "long": "72.8670442",
//   "assignedPerson": [],
//   "createdAt": "2025-04-16T04:49:47.130Z",
//   "updatedAt": "2025-04-16T04:49:47.130Z",
//   "__v": 0
// }


const columnHelper = createColumnHelper<Partner>()
// PartnerID, Partner Name, category, city, pincode, email, Phone, country, company, actions

const columns = [
  columnHelper.accessor("partnerId",{
    header: "Partner ID",
    cell: (info)=> info.getValue(),
  }),
  columnHelper.accessor("partnerName",{
    header: "Partner Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("partnerCategory",{
    header:"Category",
    cell: (info)=> info.getValue(),
  }),
  columnHelper.accessor("city",{
    header:"City",
    cell: (info)=>info.getValue(),
  }),
  columnHelper.accessor("pincode",{
    header:"Pincode",
    cell:(info)=>info.getValue(),
  }),
  columnHelper.accessor("email",{
    header:"Email",
    cell:(info)=>info.getValue()
  }),
  columnHelper.accessor("phone",{
    header:"Phone",
    cell: (info)=> info.getValue(),
  }),
  columnHelper.accessor("country",{
    header:"Country",
    cell: (info)=> info.getValue(),
  }),
  columnHelper.accessor("company",{
    header:"Company",
    cell: (info)=> info.getValue(),
  }),
  columnHelper.accessor('created_at', {
      header: 'Created At',
      cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

export default function PartnerPage(){
  const [users,setUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [partners, setPartner] = useState<Partner[]>([]);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)

  const fetchEmployeeUsers = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }

    try {
      const response = await axios.get('http://localhost:4000/api/user/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.status !== 200) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.data
      console.log(data)

      const mappedRoles = data.msg.map((user: any) => ({
        id: user.id,
        tenant_id: user.tenantId,
        firstname:user.firstname,
        name: user.name,
        phone:user.phone,
        email: user.email,
        created_at: user.createdAt,
      }));
      setUser(mappedRoles);
    } catch (error) {
      console.error('Error fetching users:', error)
    }
   }
  useEffect(()=>{
    fetchEmployeeUsers()
  },[])


  const fetchPartners = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await axios.get('http://localhost:4000/api/partner/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.status === true){
        throw new Error('Failed to fetch partners');
      }

      const data = await response.data;
      console.log('Fetched Partners:', data);
      // setPartners(data.msg);
      const mappedRoles = data.msg.map((partner: any) => ({
        id:partner._id,
        partnerId: partner.partnerId,
        partnerName: partner.partnerName,
        partnerCategory: partner.partnerCategory,
        email: partner.partnerUserEmailId,
        phone: partner.partnerAppUserPhoneNo,
        pincode: partner.pincode,
        country: partner.country,
        city: partner.city,
        company: partner.company,
        lat: partner.lat,
        long: partner.long,
        assignedPerson:partner.assignedPerson,
        created_at: partner.createdAt
      }));
      setPartner(mappedRoles);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  useEffect(()=>{
    fetchPartners()
  },[])

  // const handleDelete = async(partner: Partner) => {
  //   // In a real app, this would make an API call
  //   console.log('Delete role:', partner)
  //   // try{
  //   //   await axios.delete(`http://localhost:4000/api/tenant/delete/${role.role_id}`)
  //   //   // setRoles((prevRoles)=>prevRoles.filter((r)=>r.role_id !== role.role_id))
  //   // }catch(error){
  //   //   console.error('Error deleting role:', error)
  //   // }
  // }

  const handleDelete = async(partner:Partner) =>{
    console.log("Partner", partner)
    try{
      await axios.delete(`http://localhost:4000/api/partner/delete/${partner.id}`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setPartner((prevRoles)=>prevRoles.filter((p)=>p.id !== partner.id))
    }catch(error){
      console.error('Error deleting role:', error)
    }
  }

  // const handleEdit = async(partner:Partner)=>{
  //   console.log(partner)
  //   // try{
  //   //   const token = local
  //   // }
  // }

  const handleEditUser = (partner: Partner) => {
    console.log('Edit user:', partner)
    setEditingPartner(partner)
    setIsModalOpen(true)
  }

  console.log(isModalOpen)

  const handleAddPartner = async(data:Partner)=>{
    console.log(data)
    try{
      const token = localStorage.getItem('token');
      if(!token){
        console.error('No token found');
        return;
      }
      const response = await axios.post('http://localhost:4000/api/partner/create-partner', data,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      console.log('Added Partner:', response.data);
      if(response.data.status === true){
        // setPartners([...partners, data])
        fetchPartners()
      }
    }catch(error){
      console.error('Error creating partner:', error);
    }
  }

  console.log('partners', partners);

  return (
    <div className="space-y-4">
      <PageHeader title="Partners" 
       action={({
        label:"Add Partner",
        onClick: () => setIsModalOpen(true),
       })}
      />
      {partners.length===0?(
        <p className="text-center text-gray-500 mt-4">No Partner history available</p>
      ):(
              <DataTable 
              columns={columns} 
              data={partners} 
              onEdit={handleEditUser}
              onDelete={handleDelete}
              />
      )}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false) 
          setEditingPartner(null)
        }}
        title={editingPartner ? 'Edit Role' : 'Add Role'}
      >

      <PartnerForm
        partner={editingPartner}
        onSubmit = {(data)=>{
          console.log("Data",data)
          if(data){
            handleAddPartner(data)
            setIsModalOpen(false)
            setEditingPartner(null)
          }
        }}
        users={users}
      />
      </Modal>

    </div>
  )
}




// import React, { useState, useEffect } from 'react';
// import Button from '../../components/ui/Button';
// import { Modal } from '../../components/ui/Modal';
// import CreatePartnerForm from './PartnerForm';
// import axios from 'axios';

// interface Partner {
//   _id: string;
//   partnerId: string;
//   partnerName: string;
//   partnerCategory: string;
//   city: string;
//   pincode: string;
//   partnerUserEmailId: string;
//   partnerAppUserPhoneNo: string;
//   country: string;
//   company: string;
//   lat: string;
//   long: string;
//   assignedPerson: string;
// }

// const PartnerPage: React.FC = () => {
//   const [partners, setPartners] = useState<Partner[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

//   useEffect(() => {
//     fetchPartners();
//   }, []);

//   const fetchPartners = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error('No token found');
//       return;
//     }

//     try {
//       const response = await axios.get('http://localhost:4000/api/partner/', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.status === true){
//         throw new Error('Failed to fetch partners');
//       }

//       const data = await response.data;
//       setPartners(data.msg);
//     } catch (error) {
//       console.error('Error fetching partners:', error);
//     }
//   };

//   console.log('partners', partners);

//   const handleEdit = (partner: Partner) => {
//     setEditingPartner(partner);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (partnerId: string) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error('No token found');
//       return;
//     }

//     try {
//       const response = await fetch(`https://api.tracenac.com/api/partners/${partnerId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete partner');
//       }

//       setPartners(partners.filter((partner) => partner._id !== partnerId));
//     } catch (error) {
//       console.error('Error deleting partner:', error);
//     }
//   };

//   // const handleFormSubmit = async (data: Partner) => {
//   //   const token = localStorage.getItem('token');
//   //   if (!token) {
//   //     console.error('No token found');
//   //     return;
//   //   }

//   //   try {
//   //     const response = await axios.post('https://api.tracenac.com/api/partner/create-partner', {
//   //       method: editingPartner ? 'PUT' : 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         'Authorization': `Bearer ${token}`,
//   //       },
//   //       body: JSON.stringify(data),
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error(`Failed to ${editingPartner ? 'update' : 'create'} partner`);
//   //     }

//   //     const updatedPartner = await response.json();

//   //     if (editingPartner) {
//   //       setPartners(partners.map((partner) => (partner._id === updatedPartner._id ? updatedPartner : partner)));
//   //     } else {
//   //       setPartners([...partners, updatedPartner]);
//   //     }

//   //     setIsModalOpen(false);
//   //     setEditingPartner(null);
//   //   } catch (error) {
//   //     console.error(`Error ${editingPartner ? 'updating' : 'creating'} partner:`, error);
//   //   }
//   // };


//   const handleFormSubmit = async (data:Partner) =>{
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error('No token found');
//       return;
//     }
//     try{
//       const response = await axios.post('http://localhost:4000/api/partner/create-partner', data)
//       if (!response.status === true){
//         throw new Error('Failed to create partner');
//       }
//       if(response.data.status === true) {
//         fetchPartners();
//       }
//     }catch(error){
//       console.error('Error creating partner:', error);
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Partners</h1>
//         <Button onClick={() => setIsModalOpen(true)}>Add Partner</Button>
//       </div>

//       <table className="min-w-full bg-white border border-gray-200">
//         <thead>
//           <tr>
//             <th className="px-4 py-2 border-b">Partner ID</th>
//             <th className="px-4 py-2 border-b">Partner Name</th>
//             <th className="px-4 py-2 border-b">Category</th>
//             <th className="px-4 py-2 border-b">City</th>
//             <th className="px-4 py-2 border-b">Pincode</th>
//             <th className="px-4 py-2 border-b">Email</th>
//             <th className="px-4 py-2 border-b">Phone</th>
//             <th className="px-4 py-2 border-b">Country</th>
//             <th className="px-4 py-2 border-b">Company</th>
//             <th className="px-4 py-2 border-b">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {partners.map((partner) => (
//             <tr key={partner._id}>
//               <td className="px-4 py-2 border-b">{partner.partnerId}</td>
//               <td className="px-4 py-2 border-b">{partner.partnerName}</td>
//               <td className="px-4 py-2 border-b">{partner.partnerCategory}</td>
//               <td className="px-4 py-2 border-b">{partner.city}</td>
//               <td className="px-4 py-2 border-b">{partner.pincode}</td>
//               <td className="px-4 py-2 border-b">{partner.partnerUserEmailId}</td>
//               <td className="px-4 py-2 border-b">{partner.partnerAppUserPhoneNo}</td>
//               <td className="px-4 py-2 border-b">{partner.country}</td>
//               <td className="px-4 py-2 border-b">{partner.company}</td>
//               <td className="px-4 py-2 border-b">
//                 <Button variant="ghost" onClick={() => handleEdit(partner)}>
//                   Edit
//                 </Button>
//                 <Button variant="ghost" onClick={() => handleDelete(partner._id)}>
//                   Delete
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => {
//           // setIsModalOpen(false);
//           // setEditingPartner(null);
//         }}
//         title={editingPartner ? 'Edit Partner' : 'Add Partner'}
//       >
//         <CreatePartnerForm
//           // partner={editingPartner}
//           onSubmit={handleFormSubmit}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default PartnerPage;