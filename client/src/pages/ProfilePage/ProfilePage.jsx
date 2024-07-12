import { useState } from 'react'
import { PersonCircle, BagCheckFill, FileEarmarkMedicalFill } from 'react-bootstrap-icons'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import AccountGeneralTab from '../../components/ProfileTab/AccountGeneralTab'
import YourOrderTab from '../../components/ProfileTab/YourOrderTab'
import HealthDataTab from '../../components/ProfileTab/HealthDataTab'
import 'bootstrap/dist/css/bootstrap.min.css'
import './ProfilePage.css'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('account-general')

  return (
    <>
      <NavigationBar />
      {/* // mainContainer */}
      <div className='mainContainer '>
        <div className='backgroundRectangle' />

        {/* header */}
        <div className='card-header'>
          <h1 className='my-account-header'>My Account</h1>
        </div>
        <div className='d-flex card overflow-hidden'>
          <div className='row no-gutters row-bordered row-border-light'>
            <div className='col-md-3 border-right'>
              <div className='list-group'>

                {/* Your detail button */}
                <a
                  className={`list-group-item list-group-item-action  ${activeTab === 'account-general' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account-general')}
                  href='#account-general'
                >
                  <PersonCircle className='icon' />
                  Personal details
                </a>

                {/* Health information */}
                <a
                  className={`list-group-item list-group-item-action ${activeTab === 'account-health-info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account-health-info')}
                  href='#account-health-info'
                >
                  <FileEarmarkMedicalFill className='icon' />  Health data
                </a>

                {/*   Orders button */}
                {/* <a
                  className={`list-group-item list-group-item-action ${activeTab === 'account-orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account-orders')}
                  href='#account-orders'
                >
                  <BagCheckFill className='icon' />  Orders
                </a> */}
              </div>
            </div>

            <div className='col-md-9'>
              <div className='tab-content mb-3 mt-3'>
                {activeTab === 'account-general' && (<AccountGeneralTab />)}
                {activeTab === 'account-orders' && (<YourOrderTab />)}
                {activeTab === 'account-health-info' && (<HealthDataTab />)}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
export default ProfilePage
