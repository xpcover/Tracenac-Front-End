import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Partner,User } from '@/lib/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// partnerId: partner.partnerId,
// partnerName: partner.partnerName,
// partnerCategory: partner.partnerCategory,
// email: partner.partnerUserEmailId,
// phone: partner.partnerAppUserPhoneNo,
// pincode: partner.pincode,
// country: partner.country,
// city: partner.city,
// company: partner.company,
// created_at: partner.createdAt

const PartnerSchema = z.object({
  partnerId: z.string().min(1, 'Partner ID is required'),
  partnerName: z.string().min(1, 'Partner Name is required'),
  partnerCategory: z.string().min(1, 'Partner Category is required'),
  city: z.string().min(1, 'City is required'),
  pincode: z.string().min(1, 'Pin Code is required'),
  country: z.string().min(1, 'Country is required'),
  company: z.string().min(1, 'Company is required'),
  partnerUserEmailId: z.string().min(1,'Invalid email address'),
  partnerAppUserPhoneNo: z.string().min(1, 'Phone number is require,d'),
  latitude:z.string().min(1,'latitude is required'),
  longitude:z.string().min(1,'latitude is required'),
  assignedPerson: z.string().min(1, "Assigned is required")
})

type PartnerFormData = z.infer<typeof PartnerSchema>

interface PartnerFormProps{
  partner?: Partner | null
  onSubmit: (data: PartnerFormData) => void
  users?: any 
}

export default function PartnerForm({ partner,onSubmit,users }:PartnerFormProps) {
  // console.log(partner)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PartnerFormData>({
    resolver: zodResolver(PartnerSchema),
    defaultValues: {
      partnerId: partner?.partnerId || '',
      partnerName: partner?.partnerName || '',
      partnerCategory:partner?.partnerCategory || '',
      city: partner?.city || '',
      pincode : partner?.pincode || '',
      country: partner?.country || '',
      company : partner?.company || '',
      partnerUserEmailId : partner?.email || '',
      partnerAppUserPhoneNo : partner?.phone || '',
      latitude: partner?.lat || '',
      longitude : partner?.long || ''
    },
  })
  console.log("Partner", partner)

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setValue("latitude", position.coords.latitude.toString());
        setValue("longitude", position.coords.longitude.toString());
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="partnerId" className="block text-sm font-medium text-gray-700">
          Partner ID
        </label>
        <Input
          id="partnerId"
          type= "partnerId"
          {...register("partnerId")}
          // value={partnerId}
          // onChange={(e) => setPartnerId(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700">
          Partner Name
        </label>
        <Input
          id="partnerName"
          type= "partnerName"
          {...register("partnerName")}
          // value={partnerName}
          // onChange={(e) => setPartnerName(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="partnerCategory" className="block text-sm font-medium text-gray-700">
          Partner Category
        </label>
        <Input
          id="partnerCategory"
          type= "partnerCategory"
          {...register("partnerCategory")}
          // value={partnerCategory}
          // onChange={(e) => setPartnerCategory(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <Input
          id="city"
          type= "city"
          {...register("city")}
          // value={city}
          // onChange={(e) => setCity(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
          Pincode
        </label>
        <Input
          id="pincode"
          type= "pincode"
          {...register("pincode")}
          // value={pincode}
          // onChange={(e) => setPincode(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="partnerUserEmailId" className="block text-sm font-medium text-gray-700">
          Partner User Email ID
        </label>
        <Input
          id="partnerUserEmailId"
          type= "partnerUserEmailId"
          {...register("partnerUserEmailId")}
          // value={partnerUserEmailId}
          // onChange={(e) => setPartnerUserEmailId(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="partnerAppUserPhoneNo" className="block text-sm font-medium text-gray-700">
          Partner App User Phone No
        </label>
        <Input
          id="partnerAppUserPhoneNo"
          type= "partnerAppUserPhoneNo"
          {...register("partnerAppUserPhoneNo")}
          // value={partnerAppUserPhoneNo}
          // onChange={(e) => setPartnerAppUserPhoneNo(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <Input
          id="country"
          type= "country"
          {...register("country")}
          // value={country}
          // onChange={(e) => setCountry(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
          Company
        </label>
        <Input
          id="company"
          type= "company"
          {...register("company")}
          // value={company}
          // onChange={(e) => setCompany(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
          Latitude
        </label>
        <Input
          id="lat"
          type= "latitude"
          {...register("latitude")}
          defaultValue={partner?.lat || ''}
          // value={lat}
          // onChange={(e) => setLat(e.target.value)}
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
          type= "longitude"
          {...register("longitude")}
          defaultValue={partner?.long || ''}
          // value={long}
          // onChange={(e) => setLong(e.target.value)}
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
    {...register("assignedPerson")}  // <-- ✅ register goes here
    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  >
    <option value="">Select</option>
    {users?.map((user: any) => (
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
  )
};

