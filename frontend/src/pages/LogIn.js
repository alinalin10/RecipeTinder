import LogIn from '../Components/LogInPortal';
import PortalImage from '../Components/Dish.png' // image in components folder

const LogInPage = () => {
  return (
    <div className="portal-page-container">
      {/* Form Container Wrapper */}
      <div className="portal-form-container-wrapper">
        <LogIn />
      </div>

      {/* Image Container */}
      <div className="portal-image-container">
        <img src={PortalImage} alt="Food Visual" />
      </div>
    </div>
  );
};

export default LogInPage;
