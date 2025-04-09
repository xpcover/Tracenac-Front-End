import { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { Switch } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { menuItems } from '@/lib/menu';
import Button from '../ui/Button';

interface MenuItem {
  id: string;
  name: string;
  showWeb: boolean;
  showMobile: boolean;
  icon: React.ComponentType<{ size: number }>;
}

export function MenuArrangement() {
  const [items, setItems] = useState<MenuItem[]>(
    menuItems.map((item, index) => ({
      id: (index + 1).toString(),
      name: item.label,
      showWeb: true,
      showMobile: true,
      icon: item.icon,
    }))
  );

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
    console.log('Saved JSON:', JSON.stringify(items, null, 2));
    // Add your save logic here (e.g., send the JSON to a server)
  };

  return (
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
  );
}