import { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { Switch } from '@headlessui/react';
import { cn } from '@/lib/utils';
// import { menuItems } from '@/lib/menu';
import Button from '../ui/Button';
import axios from 'axios';

interface Tenant {
  _id: string;
  tenantId: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  showWeb: boolean;
  showMobile: boolean;
  // icon: React.ComponentType<{ size: number }>;
}

const defaultMenuItems: MenuItem[] = [
  {
    "id": "1",
    "name": "Dashboard",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "2",
    "name": "Tenants",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "3",
    "name": "Users",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "4",
    "name": "Roles",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "5",
    "name": "Permissions",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "6",
    "name": "Asset Categories",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "7",
    "name": "Asset Blocks",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "8",
    "name": "Departments",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "9",
    "name": "Locations",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "10",
    "name": "Cost Centres",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "11",
    "name": "Assets",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "12",
    "name": "Asset Components",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "13",
    "name": "Depreciation Records",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "14",
    "name": "Asset History",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "15",
    "name": "Contracts",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "16",
    "name": "Budgets",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "17",
    "name": "Forex Rates",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "18",
    "name": "Notifications",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "19",
    "name": "Shift Usage",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "20",
    "name": "Reports",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "21",
    "name": "Report Permissions",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "22",
    "name": "Asset Labels",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "23",
    "name": "Barcode Scans",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "24",
    "name": "Impairment Records",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "25",
    "name": "Leases",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "26",
    "name": "WIP Assets",
    "showWeb": true,
    "showMobile": true
  },
  {
    "id": "27",
    "name": "Documentation",
    "showWeb": true,
    "showMobile": false
  }
];

export function MenuArrangement() {
  const [items, setItems] = useState<MenuItem[]>(defaultMenuItems);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await axios.get('https://api.tracenac.com/api/tenant/get-clients');
      setTenants(response.data.msg);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const handleTenantChange = async (tenantId: string) => {
    setSelectedTenant(tenantId);
    setError(null);
    
    if (!tenantId) {
      setItems(items.map((item, index) => ({
        id: (index + 1).toString(),
        name: item.name,
        showWeb: true,
        showMobile: true,
        // icon: item.icon,
      })));
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`https://api.tracenac.com/api/tenant/get-menu-admin/${tenantId}`);
      console.log('Menu response:', response.data);
      if (response.data ) {
        console.log('Menu configuration found:', response.data.msg[0].menu);
        setItems(response.data.msg[0].menu);
      } else {
        console.log('No menu configuration found, using default items');
        // If no menu configuration exists, use default items
        setItems(items.map((item, index) => ({
          id: (index + 1).toString(),
          name: item.name,
          showWeb: true,
          showMobile: true,
          // icon: item.icon,
        })));
      }
    } catch (error) {
      setError('No menu configuration found for this tenant');
      setItems(items.map((item, index) => ({
        id: (index + 1).toString(),
        name: item.name,
        showWeb: true,
        showMobile: true,
        // icon: item.icon,
      })));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  const toggleVisibility = (id: string, platform: 'web' | 'mobile') => {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [platform === 'web' ? 'showWeb' : 'showMobile']: 
            !item[platform === 'web' ? 'showWeb' : 'showMobile']
        };
      }
      return item;
    }));
  };

  const handleNameChange = (id: string, newName: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          name: newName
        };
      }
      return item;
    }));
  };

  const handleSave = () => {
    if (!selectedTenant) {
      alert('Please select a tenant first');
      return;
    }
    
    const menuConfig = {
      tenantId: selectedTenant,
      menu: items
    };

    // integrate this post api https://api.tracenac.com/api/tenant/post-menu
    axios.post('https://api.tracenac.com/api/tenant/post-menu', menuConfig)
      .then(response => {
        console.log('Menu configuration saved successfully:', response.data);
        alert('Menu configuration saved successfully');
      })
      .catch(error => {
        console.error('Error saving menu configuration:', error);
        alert('Failed to save menu configuration');
      });
    
    console.log('Saved JSON:', JSON.stringify(menuConfig, null, 2));
    // Add your save logic here to save menu configuration for specific tenant
  };

  return (
    <div className="space-y-4">
      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Tenant
        </label>
        <select
          value={selectedTenant}
          onChange={(e) => handleTenantChange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select a tenant</option>
          {tenants.map((tenant) => (
            <option key={tenant._id} value={tenant.tenantId}>
              {tenant.name} ({tenant.tenantId})
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="flex space-x-4">
          <div className="space-y-4 flex-1">
            <DragDropContext onDragEnd={handleDrop}>
              <Droppable droppableId="menu-arrangement">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2 bg-gray-50 rounded mb-2">
                            <div className="flex items-center justify-between">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleNameChange(item.id, e.target.value)}
                                className="flex-1 border-none focus:ring-0 bg-transparent"
                              />
                              <Switch
                                checked={item.showMobile}
                                onChange={() => toggleVisibility(item.id, 'mobile')}
                                className={cn(
                                  item.showMobile ? 'bg-blue-600' : 'bg-gray-200',
                                  'relative inline-flex items-center h-6 rounded-full w-11'
                                )}
                              >
                                <span className="sr-only">Show on Mobile</span>
                                <span
                                  className={cn(
                                    item.showMobile ? 'translate-x-6' : 'translate-x-1',
                                    'inline-block w-4 h-4 transform bg-white rounded-full'
                                  )}
                                />
                              </Switch>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div className="flex-1 p-4 bg-gray-100 rounded">
            <div style={{display: 'flex', width: '50%',  justifyContent: 'space-between',alignItems:"center",padding:"10px"}}>
            <h2 className="text-xl font-bold mb-2">Live JSON</h2>  <Button onClick={handleSave} className="mt-4">
              Save
            </Button>
            </div>
            
            <pre className="bg-white p-2 rounded overflow-auto">
              {JSON.stringify(items, null, 2)}
            </pre>
           
          </div>
        </div>
      )}
    </div>
  );
}