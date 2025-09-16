import SignUp from '../Components/SignUpPortal'
import PortalImage from '../Components/Dish.png' // image in components folder

const SignUpPage = () => {
  return (
    <div className="portal-page-container">
      {/* Form Container Wrapper */}
      <div className="portal-form-container-wrapper">
        <SignUp />
      </div>

      {/* Image Container */}
      <div className="portal-image-container">
        <img src={PortalImage} alt="Food Visual" />
      </div>
    </div>
  );
};

export default SignUpPage;
