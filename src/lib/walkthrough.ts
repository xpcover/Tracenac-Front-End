import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

// Create a singleton instance of the driver
const driverInstance = driver({
  animate: true,
  opacity: 0.75,
  showProgress: true,
  showButtons: ['next', 'previous', 'close'],
  steps: []
})

// Define walkthrough steps for different features
export const walkthroughs = {
  main: [
    {
      element: '#sidebar',
      popover: {
        title: 'Navigation Menu',
        description: 'Access all main features from this menu. Click items to expand sub-menus.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '#top-bar',
      popover: {
        title: 'Quick Access',
        description: 'Access setup, notifications, and your profile from here.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#search-filter',
      popover: {
        title: 'Search & Filters',
        description: 'Quickly find what you need using search and advanced filters.',
        side: 'bottom',
        align: 'start'
      }
    }
  ],
  assetManagement: [
    {
      element: '#asset-list',
      popover: {
        title: 'Asset List',
        description: 'View and manage all your assets from this table.',
        side: 'top',
        align: 'start'
      }
    },
    {
      element: '#add-asset-btn',
      popover: {
        title: 'Add New Asset',
        description: 'Click here to add a new asset to the system.',
        side: 'left',
        align: 'start'
      }
    },
    {
      element: '#asset-filters',
      popover: {
        title: 'Asset Filters',
        description: 'Filter assets by various criteria like status, type, and location.',
        side: 'bottom',
        align: 'start'
      }
    }
  ],
  reports: [
    {
      element: '#reports-menu',
      popover: {
        title: 'Reports Menu',
        description: 'Access different types of reports from this section.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '#create-report-btn',
      popover: {
        title: 'Create Reports',
        description: 'Generate new reports with various templates.',
        side: 'left',
        align: 'start'
      }
    }
  ]
}

// Function to start a specific walkthrough
export const startWalkthrough = (type: keyof typeof walkthroughs) => {
  driverInstance.setSteps(walkthroughs[type])
  driverInstance.drive()
}

// Function to stop the current walkthrough
export const stopWalkthrough = () => {
  driverInstance.destroy()
}