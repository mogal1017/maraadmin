import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
//import SignUp from './pages/Authentication/SignUp';
import ECommerce from './pages/Dashboard/ECommerce';
import CmsUser from './pages/CmsUser/CmsUser';
import CreateCmsUser from './pages/CmsUser/CreateCmsUser';
import EditCmsUser from './pages/CmsUser/EditCmsUser';
import ViewCmsUser from './pages/CmsUser/ViewCmsUser';
import { LanguageMaster } from './pages/Masters/LanguageMaster/LanguageMaster';
import { AllergyMaster } from './pages/Masters/AllergyMaster/AllergyMaster';
import { InsuranceMaster } from './pages/Masters/InsuranceMaster/InsuranceMaster';
import { RelationMaster } from './pages/Masters/RelationMaster/RelationMaster';
import { SpecialityMaster } from './pages/Masters/SpecialityMaster/SpecialityMaster';
import { PractitionerSymptomsMaster } from './pages/Masters/PractitionerSymptomsMasters/PractitionerSymptomsMasters';
import { PractitionerServiceMaster } from './pages/Masters/PractitionerServiceMasters/PractitionerServiceMasters';
import SubscriptionMaster from './pages/Masters/SubscriptionMaster/SubscriptionMaster';
import CreateSubscription from './pages/Masters/SubscriptionMaster/CreateSubscription';
import EditSubscription from './pages/Masters/SubscriptionMaster/EditSubscription';
import ViewSubscription from './pages/Masters/SubscriptionMaster/ViewSubscription';
import Practitioners from './pages/Practitioners/Practitioners';
import Viewpractitioner from './pages/Practitioners/Viewpractitioners';
import Patients from './pages/Patients/Patients';
import Viewpatient from './pages/Patients/Viewpatients';
import Patientappointments from './pages/Patient Appointments/Patientappointments';
import Viewpatientappointment from './pages/Patient Appointments/Viewpatientappointment';
import { Clinic } from './pages/Clinic/Clinic';
import ClinicView from './pages/Clinic/ClinicView';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store/store';
import { selectUser } from './redux/actions/userSlice';
import { ClinicSignup } from './pages/ClinicSignup/ClinicSignup';
import { InsuranceCarrierMaster } from './pages/Masters/InsuranceCarrier/InsuranceCarrierMaster';
import { BlogMaster } from './pages/Masters/BlogMaster/BlogMaster';
import { CreateBlog } from './pages/Masters/BlogMaster/CreateBlog';
import { EditBlog } from './pages/Masters/BlogMaster/EditBlog';
import { CreateFAQ } from './pages/Masters/FAQ/CreateFAQ';
import { FAQ } from './pages/Masters/FAQ/FAQ';
import { EditFAQ } from './pages/Masters/FAQ/EditFAQ';
import { Help } from './pages/Masters/Help/Help';
import { CreateHelp } from './pages/Masters/Help/CreateHelp';
import EditHelp from './pages/Masters/Help/EditHelp';
import ClinicEdit from './pages/Clinic/ClinicEdit';
import { Services } from './pages/Masters/Services/Services';
import { ServicesDetails } from './pages/Masters/ServicesDetails/ServicesDetails';
import CreateServiceDetails from './pages/Masters/ServicesDetails/CreateServiceDetails';
import { EditServiceDetails } from './pages/Masters/ServicesDetails/EditServiceDetails';

function App() {
  const userData = useSelector(selectUser);

  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    setUser(userData.isLoggedIn);
  }, [userData]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            user && user ? (
              <>
                <PageTitle title="Dashboard" />
                <ECommerce />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/cmsUser"
          element={
            user && user ? (
              <>
                <PageTitle title="CMS User" />
                <CmsUser />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/cmsUser/createCmsUser"
          element={
            user && user ? (
              <>
                <PageTitle title="Add User" />
                <CreateCmsUser />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/cmsUser/editCmsUser/:userId"
          element={
            user && user ? (
              <>
                <PageTitle title="Update User" />
                <EditCmsUser />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/cmsUser/viewCmsUser/:userId"
          element={
            user && user ? (
              <>
                <PageTitle title="View User" />
                <ViewCmsUser />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />

        <Route
          path="/LanguageMaster"
          element={
            user && user ? (
              <>
                <PageTitle title="Language " />
                <LanguageMaster />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />

        <Route
          path="/AllergyMaster"
          element={
            user && user ? (
              <>
                <PageTitle title="Allergy " />
                <AllergyMaster />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />

        <Route
          path="/InsuranceMaster"
          element={
            user && user ? (
              <>
                <PageTitle title="Insurance" />
                <InsuranceMaster />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/InsuranceCarrierMaster"
          element={
            user && user ? (
              <>
                <PageTitle title="Insurance" />
                <InsuranceCarrierMaster />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />

        <Route
          path="/RelationMaster"
          element={
            user && user ? (
              <>
                <PageTitle title="Relation" />
                <RelationMaster />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />

        <Route
          path="/SpecialityMaster"
          element={
            user && user ? (
              <>
                <PageTitle title="Speciality" />
                <SpecialityMaster />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/PractitionerSymptomsMaster"
          element={
            user && user ? (
              <>
                <PageTitle title="Symptoms" />
                <PractitionerSymptomsMaster />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/PractitionerServiceMaster"
          element={
            user && user ? (
              <>
                <PageTitle title="Service" />
                <PractitionerServiceMaster />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/subscriptionmaster"
          element={
            user && user ? (
              <>
                <PageTitle title="Subscription" />
                <SubscriptionMaster />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/subscriptionmaster/createSubscription"
          element={
            user && user ? (
              <>
                <PageTitle title="Add Subcription" />
                <CreateSubscription />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/BlogMaster"
          element={
            user && user ? (
              <>
                <PageTitle title="Testimonial" />
                <BlogMaster />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/BlogMaster/CreateBlog"
          element={
            user && user ? (
              <>
                <PageTitle title="Add Testimonial" />
                <CreateBlog />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="BlogMaster/EditBlog/:id"
          element={
            user && user ? (
              <>
                <PageTitle title=" Update Testimonial" />
                <EditBlog />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/FAQ/CreateFaq"
          element={
            user && user ? (
              <>
                <PageTitle title="Add FAQ" />
                <CreateFAQ />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="FAQ"
          element={
            user && user ? (
              <>
                <PageTitle title=" FAQ" />
                <FAQ />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/FAQ/EditFAQ/:id"
          element={
            user && user ? (
              <>
                <PageTitle title="Update FAQ" />
                <EditFAQ />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="Help"
          element={
            user && user ? (
              <>
                <PageTitle title=" Help" />
                <Help />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/Help/CreateHelp"
          element={
            user && user ? (
              <>
                <PageTitle title="Add Help" />
                <CreateHelp />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/Help/EditHelp/:id"
          element={
            user && user ? (
              <>
                <PageTitle title="Update Help" />
                <EditHelp />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/subscriptionmaster/editSubscription/:userId"
          element={
            user && user ? (
              <>
                <PageTitle title="Update Subscription" />
                <EditSubscription />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/subscriptionmaster/viewSubscription/:userId"
          element={
            user && user ? (
              <>
                <PageTitle title="view Subscription" />
                <ViewSubscription />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/practitioners"
          element={
            user && user ? (
              <>
                <PageTitle title="Practitioners" />
                <Practitioners />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/practitioners/viewpractitioners/:userId"
          element={
            user && user ? (
              <>
                <PageTitle title=" Practitioners View" />
                <Viewpractitioner />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/patients"
          element={
            user && user ? (
              <>
                <PageTitle title="Patients" />
                <Patients />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/patients/viewpatients/:userId"
          element={
            user && user ? (
              <>
                <PageTitle title=" Patient View" />
                <Viewpatient />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/patientappointments"
          element={
            user && user ? (
              <>
                <PageTitle title="Patients Appointments" />
                <Patientappointments />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/patientappointments/viewpatientappointments/:userId"
          element={
            user && user ? (
              <>
                <PageTitle title=" Patient Appointment View" />
                <Viewpatientappointment />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/Clinic"
          element={
            user && user ? (
              <>
                <PageTitle title="Clinic" />
                <Clinic />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/Clinic/ClinicView/:clinicId"
          element={
            user && user ? (
              <>
                <PageTitle title="Clinic View" />
                <ClinicView />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/Clinic/ClinicEdit/:clinicId"
          element={
            user ? (
              <>
                <PageTitle title="Clinic Update" />
                <ClinicEdit />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />

        <Route
          path="/ClinicSignup"
          element={
            user && user ? (
              <>
                <PageTitle title="ClinicSignup" />
                <ClinicSignup />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />

        <Route
          path="/Services"
          element={
            user && user ? (
              <>
                <PageTitle title="Services" />
                <Services />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />

        <Route
          path="/ServicesDetails"
          element={
            user && user ? (
              <>
                <PageTitle title="Services Details" />
                <ServicesDetails />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
        <Route
          path="/ServicesDetails/CreateServiceDetails"
          element={
            user && user ? (
              <>
                <PageTitle title=" Add Services Details" />
                <CreateServiceDetails />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />

        <Route
          path="ServiceDetails/EditServiceDetails/:id"
          element={
            user && user ? (
              <>
                <PageTitle title=" Update Service Details" />
                <EditServiceDetails />
              </>
            ) : (
              <Navigate to="/auth/signin" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
